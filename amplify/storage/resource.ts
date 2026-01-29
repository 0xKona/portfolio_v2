import { defineStorage } from "@aws-amplify/backend";

// Sets up a S3 Bucket for storing images
export const storage = defineStorage({
    name: 'portfolio_site_project_images',
    access: (allow) => ({
        '*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read', 'write', 'delete'])
        ]
    })
})