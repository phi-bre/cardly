<script lang="ts">
  import Question from '$lib/Question.svelte';
  import { onMount } from 'svelte';
  import Review from '$lib/Review.svelte';

  interface Question {
    q: string;
    a: string[];
  }

  interface Quiz {
    title: string;
    questions: Question[];
  }

  let quizzes: Quiz[] = [];
  let selectedQuizzes: string[] = [];
  let remainingQuestions: Question[];
  let correctlyAnsweredQuestions = [];
  let wronglyAnsweredQuestions = [];

  $: questions = quizzes
    .filter((quiz) => selectedQuizzes.includes(quiz.title))
    .flatMap((quiz) => quiz.questions);
  $: currentQuestion = remainingQuestions[0];
  $: answeredQuestions = correctlyAnsweredQuestions.concat(wronglyAnsweredQuestions);
  $: remainingQuestions = questions.filter(
    (question) => !answeredQuestions.includes(question as Question),
  );

  function nextQuestion() {
    // Remove the top question from the remaining questions
    remainingQuestions = remainingQuestions.slice(1);
  }

  function checkAnswer({ detail: answer }: CustomEvent<string>) {
    currentQuestion.userAnswer = answer;
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

  onMount(async () => {
    quizzes = await Promise.all(
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
  <!-- <div class="mb-16">
    <input type="text" placeholder="OpenAI Organisation" />
    <input type="text" placeholder="OpenAI API Key" />
  </div> -->
  <div class="flex items-center my-4 gap-2 flex-wrap">
    {#each quizzes as quiz}
      <label
        class="cursor-pointer select-none bg-malibu/20 text-malibu font-semibold text-sm rounded p-2 px-3"
        for={quiz.title}
        class:!bg-shark-400={!selectedQuizzes.includes(quiz.title)}
        class:!text-shark-50={!selectedQuizzes.includes(quiz.title)}
      >
        <input
          class="mr-1"
          type="checkbox"
          id={quiz.title}
          bind:group={selectedQuizzes}
          value={quiz.title}
        />
        {quiz.title}
      </label>
    {/each}
  </div>

  <div class="bg-shark-400 rounded-full h-2 overflow-hidden">
    <div
      class="bg-malibu h-2 rounded-full transition-all"
      style:width="{(100 / questions.length) * (questions.length - remainingQuestions.length)}%"
    >
      &nbsp;
    </div>
  </div>
  {#if remainingQuestions.length > 0}
    <Question question={remainingQuestions[0]} on:answer={checkAnswer} />
  {:else if questions.length === 0}
    <p class="my-4 text-lg min-h-[96px] font-semibold">Select a quiz to get started.</p>
  {:else}
    <p class="my-4 text-lg min-h-[96px] font-semibold">
      You scored {correctlyAnsweredQuestions.length} out of {questions.length}.
    </p>
    <Review questionsToReview={wronglyAnsweredQuestions} on:reviewComplete={restart} />
  {/if}
</div>
