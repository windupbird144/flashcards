// Create a card
export const createCard = ({ deck, front, back }) => ({
  deck,
  front,
  back,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  scheduled: Date.now(),
  // New cards are in the first bucket
  bucket: 1,
  /**
   * The crypto API caused problems in Safari during development
   */
  key: Math.random().toString(36),
});

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const BUCKET_SCHEDULES = [
  0, // This is just padding, a card is never in bucket 0
  0,
  4 * HOUR,
  2 * DAY,
  7 * DAY,
  14 * DAY,
];

// Move the bucket with a delta +1 or -1,
// ensuring it is always between 1 and 5
function moveBucket(currentBucket, remembered) {
  let delta = remembered ? 1 : -1;
  const newBucket = currentBucket + delta;
  if (newBucket < 1) return 1;
  if (newBucket > 5) return 5;
  return newBucket;
}

export function judgeCard(card, remembered) {
  // If you remember this card, move it to the next bucket (1 -> 2)
  // If you did not remember, move it to the previous bucket (2 -> 1)
  const newBucket = moveBucket(card.bucket, remembered);

  // Schedule it according to the bucket it is in
  const newScheduled = Date.now() + BUCKET_SCHEDULES[newBucket];

  return {
    ...card,
    bucket: newBucket,
    scheduled: newScheduled,
  };
}
