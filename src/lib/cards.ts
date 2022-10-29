export type Card = {
    key: string,
    createdAt: number,
    updatedAt: number,
    front: string,
    back: string,
    scheduled: number,
    bucket: number
}

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24


const BUCKET_SCHEDULES = [
 0, // This is just padding, a card is never in bucket 0
 0,
 (4 * HOUR),
 (2 * DAY),
 (7 * DAY),
 (14 * DAY)
]


export function newCard(card: Pick<Card, 'front' | 'back'>) : Card {
    // A new card is in bucket 1
    const bucket = 1
    const scheduled = Date.now() + BUCKET_SCHEDULES[bucket]
    const createdAt = Date.now()
    return {
        ...card,
        bucket,
        scheduled,
        createdAt,
        updatedAt: createdAt,
        /**
         * crypto.randomUUID caused problems during development in iOS
         * so Math.random() is used as the key instead
         */
        key: Math.random().toString(36)
    }
}

// Move the bucket with a delta +1 or -1,
// ensuring it is always between 1 and 5
function moveBucket(currentBucket : number, remembered: boolean) {
    let delta = remembered ? 1 : -1
    const newBucket = currentBucket + delta
    if (newBucket < 1) return 1
    if (newBucket > 5) return 5
    return newBucket
}

export function judgeCard(card : Card, remembered : boolean) {
    // If you remember this card, move it to the next bucket (1 -> 2)
    // If you did not remember, move it to the previous bucket (2 -> 1)
    const newBucket = moveBucket(card.bucket, remembered)

    // Schedule it according to the bucket it is in
    const newScheduled = Date.now() + BUCKET_SCHEDULES[newBucket]

    return {
        ...card,
        bucket: newBucket,
        scheduled: newScheduled
    }
}
