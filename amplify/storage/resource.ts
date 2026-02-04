import { defineStorage } from "@aws-amplify/backend";

// Sets up a S3 Bucket for storing images
export const storage = defineStorage({
    // use a unique storage name to avoid S3 bucket name collisions
    name: `portfolio-v2-images`,
    access: (allow) => ({
        'projects/*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read', 'write', 'delete'])
        ]
    })
})