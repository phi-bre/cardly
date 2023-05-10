<script lang="ts">
  import type { AnsweredQuestion } from '../../interfaces';
  import QuestionSection from '$lib/QuestionSection.svelte';
  import ReviewSection from '$lib/ReviewSection.svelte';
  import ProgressBar from '$lib/ProgressBar.svelte';
  import NoticeCard from '$lib/NoticeCard.svelte';
  import { local, remote } from '../../storage';

  let answeredQuestions: AnsweredQuestion[] = [];

  $: questions = $remote.quizzes
    .filter((quiz) => $local.selectedQuizzes.includes(quiz.id))
    .flatMap((quiz) => quiz.questions);
  $: remainingQuestions = questions.filter((question) => {
    return !answeredQuestions.find(
      (answeredQuestion) => answeredQuestion.question.id === question.id,
    );
  });
  $: [currentQuestion] = remainingQuestions;
  $: progress = (1 / questions.length) * (questions.length - remainingQuestions.length);

  function checkAnswer({ detail: answer }: CustomEvent<string>) {
    if (!currentQuestion) return;
    answeredQuestions = [...answeredQuestions, { question: currentQuestion, answer }];
  }

  function skipAnswer() {
    if (!currentQuestion) return;
    answeredQuestions = [...answeredQuestions, { question: currentQuestion, answer: '' }];
  }

  function restart() {
    answeredQuestions = [];
  }
</script>

<div class="container m-auto max-w-5xl px-8 py-4 md:py-16">
  <div class="flex justify-between py-4">
    <a href="/" class="text-medium text-sm text-neutral-400">Go back</a>
    <button class="text-medium text-sm text-neutral-400" on:click={skipAnswer}>Skip</button>
  </div>
  <ProgressBar {progress} />

  {#if remainingQuestions.length > 0}
    <QuestionSection question={currentQuestion} on:answer={checkAnswer} />
  {:else if questions.length === 0}
    <NoticeCard>Select a topic to get started.</NoticeCard>
  {:else}
    <ReviewSection {answeredQuestions} on:reviewComplete={restart} />
  {/if}
</div>
