<script lang="ts">
  import type { CardAnswer, Card, Answer } from '../../interfaces';
  import LearningCard from '$lib/LearningCard.svelte';
  import ReviewSection from '$lib/ReviewSection.svelte';
  import ProgressBar from '$lib/ProgressBar.svelte';
  import NoticeCard from '$lib/NoticeCard.svelte';
  import { local, remote } from '../../storage';

  // TODO: Improve
  $: cards = $remote.collection.cards ||= [];

  let cardAnswers: CardAnswer[] = [];

  $: selectedCards = cards.filter((card) => {
    return card.topics.some((cardTopic) =>
      $local.selectedTopics.some((selectedTopic) => selectedTopic === cardTopic),
    );
  });
  $: remainingQuestions = selectedCards.filter(function cardHasNotBeenAnswered(card: Card) {
    console.log(cardAnswers);
    return !cardAnswers.find((cardAnswer) => {
      return cardAnswer.question.id === card.id;
    });
  });
  $: [currentQuestion] = remainingQuestions;
  $: progress = (1 / selectedCards.length) * (selectedCards.length - remainingQuestions.length);
  $: wasLastQuestionWrong =
    cardAnswers.length > 0 && cardAnswers[cardAnswers.length - 1].accuracy === 0;

  function checkAnswer({ detail: answer }: CustomEvent<Answer>) {
    if (!currentQuestion) return;
    const cardAnswer: CardAnswer = {
      question: currentQuestion,
      answer: answer.text,
      accuracy: answer.correct ? 1 : 0,
    };
    cardAnswers = [...cardAnswers, cardAnswer];
  }

  function skipCard() {
    if (!currentQuestion) return;
    cardAnswers = [...cardAnswers, { question: currentQuestion, answer: '', accuracy: 0 }];
  }

  function restart() {
    cardAnswers = [];
  }
</script>

<main>
  <div class="flex justify-between py-4">
    <a href="/" class="text-medium text-sm text-neutral-400">Go back</a>
    <span>{cardAnswers.length} / {selectedCards.length}</span>
    <button class="text-medium text-sm text-neutral-400" on:click={skipCard}>Skip</button>
  </div>
  <ProgressBar {progress} />

  {#if wasLastQuestionWrong}
    wrong
  {/if}

  {#if remainingQuestions.length > 0}
    <LearningCard card={currentQuestion} on:answer={checkAnswer} />
  {:else if selectedCards.length === 0}
    <NoticeCard>Select a topic to get started.</NoticeCard>
  {:else}
    <ReviewSection {cardAnswers} on:reviewComplete={restart} />
  {/if}
</main>
