<script lang="ts">
  import type { Quiz, Question } from '../interfaces';
  import QuestionSection from '$lib/QuestionSection.svelte';
  import ReviewSection from '$lib/ReviewSection.svelte';
  import OpenAISection from '$lib/OpenAISection.svelte';
  import { onMount } from 'svelte';
  import { remote } from '../storage';

  let selectedQuizzes: string[] = [];
  let fallbackQuizzes: Quiz[] = [];
  let remainingQuestions: Question[] = [];
  let correctlyAnsweredQuestions: Question[] = [];
  let wronglyAnsweredQuestions: Question[] = [];
  let userAnswers = new Map<Question, string>(); // TODO: Use ids for questions (this might break if a question get's changed without reusing the same reference)

  $: quizzes = [...fallbackQuizzes, ...$remote.quizzes];
  $: questions = quizzes
    .filter((quiz) => selectedQuizzes.includes(quiz.title))
    .flatMap((quiz) => quiz.questions);

  $: currentQuestion = remainingQuestions[0];
  $: answeredQuestions = correctlyAnsweredQuestions.concat(wronglyAnsweredQuestions);
  $: remainingQuestions = questions.filter((question) => !answeredQuestions.includes(question));

  function nextQuestion() {
    // Remove the top question from the remaining questions
    remainingQuestions = remainingQuestions.slice(1);
  }

  function checkAnswer({ detail: answer }: CustomEvent<string>) {
    userAnswers.set(currentQuestion, answer);
    if (answer === currentQuestion.a[0]) {
      correctlyAnsweredQuestions = [...correctlyAnsweredQuestions, currentQuestion];
    } else {
      wronglyAnsweredQuestions = [...wronglyAnsweredQuestions, currentQuestion];
    }
    nextQuestion();
  }

  function restart() {
    correctlyAnsweredQuestions = [];
    wronglyAnsweredQuestions = [];
    remainingQuestions = questions;
  }

  // function removeQuiz(quiz: Quiz) {
  //   const index = $remote.quizzes.indexOf(quiz);
  //   if (index > -1) {
  //     $remote.quizzes.splice(index, 1);
  //   } else {
  //     console.error('Quiz is not part of remote quizzes.');
  //   }
  // }

  onMount(async () => {
    fallbackQuizzes = await Promise.all(
      [
        '/quizzes/WING/4-P-Mix.md.gpt.json',
        '/quizzes/WING/Basics.md.gpt.json',
        '/quizzes/WING/Kalkulation.md.gpt.json',
        '/quizzes/WING/Markenführung.md.gpt.json',
        '/quizzes/WING/Marketing.md.gpt.json',
        '/quizzes/WING/Materialwirtschaft.md.gpt.json',
      ].map((url) => fetch(url).then((res) => res.json())),
    );
  });
</script>

<svelte:head>
  <title>cardly.</title>
</svelte:head>

<div class="container m-auto py-4 md:py-16 px-8">
  <div class="mb-16">
    <OpenAISection />
  </div>

  <div class="flex items-center my-4 gap-2 flex-wrap">
    {#each quizzes as quiz}
      <label
        class="cursor-pointer select-none bg-teal-500/20 text-teal-500 font-semibold text-sm rounded p-2 px-3"
        for={quiz.title}
        class:!bg-neutral-700={!selectedQuizzes.includes(quiz.title)}
        class:!text-neutral-500={!selectedQuizzes.includes(quiz.title)}
      >
        <input
          class="mr-1"
          type="checkbox"
          id={quiz.title}
          bind:group={selectedQuizzes}
          value={quiz.title}
        />
        <span>{quiz.title}</span>
        <!-- <button class="ml-2 text-xs text-red-500" on:click={() => removeQuiz(quiz)}> x </button> -->
      </label>
    {/each}
  </div>

  <div class="bg-neutral-700 rounded-full h-2 overflow-hidden">
    <div
      class="bg-teal-500 h-2 rounded-full transition-all"
      style:width="{(100 / questions.length) * (questions.length - remainingQuestions.length)}%"
    >
      &nbsp;
    </div>
  </div>
  {#if remainingQuestions.length > 0}
    <QuestionSection question={remainingQuestions[0]} on:answer={checkAnswer} />
  {:else if questions.length === 0}
    <p class="my-4 text-lg min-h-[96px] font-semibold">Select a quiz to get started.</p>
  {:else}
    <p class="my-4 text-lg min-h-[96px] font-semibold">
      You scored {correctlyAnsweredQuestions.length} out of {questions.length}.
    </p>
    <ReviewSection
      {userAnswers}
      questionsToReview={wronglyAnsweredQuestions}
      on:reviewComplete={restart}
    />
  {/if}
</div>
