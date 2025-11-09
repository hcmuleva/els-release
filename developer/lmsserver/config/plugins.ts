module.exports = ({ env }) => ({
    "users-permissions": {
        config: {
            ratelimit: {
                interval: 1,
                max: 10000000,
            },
        },
    },
    upload: {
        config: {
            provider: "aws-s3",
            providerOptions: {
                s3Options: {
                    accessKeyId: env("AWS_ACCESS_KEY_ID"),
                    secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
                    region: env("AWS_REGION"),
                    params: {
                        Bucket: env("AWS_BUCKET"),
                        // Do NOT include ACL parameter for buckets with ACLs disabled
                    },
                },
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
            sizeLimit: 50 * 1024 * 1024,
        },
    },
});