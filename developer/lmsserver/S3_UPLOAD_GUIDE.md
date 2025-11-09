# AWS S3 Upload Configuration for Strapi v5

This guide explains how to configure AWS S3 for media uploads in your Strapi v5 application.

## 📦 Installation

The required package has been installed:
```bash
npm install @strapi/provider-upload-aws-s3
```

## 🔧 Configuration Files

### 1. Environment Variables (`.env`)

Add the following variables to your `.env` file:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name-here
AWS_S3_ENDPOINT=
# Use 'local' for local storage or 's3' for AWS S3
UPLOAD_PROVIDER=local
```

### 2. Plugin Configuration (`config/plugins.ts`)

The configuration has been updated to support both local and S3 storage:

```typescript
export default ({ env }) => {
  const uploadProvider = env('UPLOAD_PROVIDER', 'local');

  // Local upload configuration (default)
  const localConfig = {
    upload: {
      config: {
        sizeLimit: 250 * 1024 * 1024, // 250MB
      },
    },
  };

  // AWS S3 upload configuration
  const s3Config = {
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          },
          region: env('AWS_REGION', 'us-east-1'),
          params: {
            ACL: 'public-read',
            Bucket: env('AWS_S3_BUCKET'),
          },
        },
      },
    },
  };

  return uploadProvider === 's3' ? s3Config : localConfig;
};
```

## 🪣 AWS S3 Setup

### Step 1: Create an S3 Bucket

1. Go to AWS Console → S3
2. Click "Create bucket"
3. **Bucket name**: Choose a unique name (e.g., `my-lms-media-bucket`)
4. **Region**: Select your preferred region (e.g., `us-east-1`)
5. **Block Public Access**: UNCHECK "Block all public access" (if you want public files)
6. Click "Create bucket"

### Step 2: Configure Bucket CORS

Add CORS configuration to allow uploads from your application:

1. Go to your bucket → Permissions → CORS
2. Add this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:1337", "http://localhost:3030"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### Step 3: Create IAM User

1. Go to AWS Console → IAM → Users
2. Click "Add users"
3. **User name**: `strapi-s3-uploader`
4. **Access type**: Programmatic access
5. **Permissions**: Attach existing policy → `AmazonS3FullAccess` (or create custom policy)
6. Download the **Access Key ID** and **Secret Access Key**

### Step 4: Custom IAM Policy (Recommended)

For better security, create a custom policy with minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name-here/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::your-bucket-name-here"
    }
  ]
}
```

## 🚀 Usage

### Switching Between Local and S3

**Local Storage (Default):**
```bash
UPLOAD_PROVIDER=local
```

**AWS S3 Storage:**
```bash
UPLOAD_PROVIDER=s3
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=my-lms-media-bucket
```

### Testing S3 Upload

1. Update `.env` with your S3 credentials
2. Set `UPLOAD_PROVIDER=s3`
3. Restart Strapi: `npm run develop`
4. Go to Content Manager → Upload a file
5. Check your S3 bucket for the uploaded file

## 📊 Configuration Options

### File Access Control

**Public Files (default):**
```typescript
params: {
  ACL: 'public-read',
  Bucket: env('AWS_S3_BUCKET'),
}
```

**Private Files:**
```typescript
params: {
  ACL: 'private',
  Bucket: env('AWS_S3_BUCKET'),
}
```

### Custom Endpoint (for S3-compatible services)

If using MinIO, DigitalOcean Spaces, or other S3-compatible services:

```bash
AWS_S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
```

### File Size Limit

Adjust in `plugins.ts`:
```typescript
sizeLimit: 250 * 1024 * 1024, // 250MB
```

## 🧪 Testing Checklist

- [ ] AWS credentials configured in `.env`
- [ ] S3 bucket created and accessible
- [ ] CORS configured on bucket
- [ ] IAM user has proper permissions
- [ ] `UPLOAD_PROVIDER=s3` set in `.env`
- [ ] Strapi restarted after configuration
- [ ] Test file upload through Content Manager
- [ ] Verify file appears in S3 bucket
- [ ] Test file download/access via URL

## 🔍 Troubleshooting

### Error: "Access Denied"
- Check IAM user permissions
- Verify Access Key ID and Secret Key
- Ensure bucket policy allows uploads

### Error: "CORS Error"
- Add your domain to CORS configuration
- Include both frontend and backend URLs

### Files Not Accessible
- Check bucket ACL settings
- Verify `ACL: 'public-read'` in config
- Ensure "Block Public Access" is disabled

### Wrong URL Format
- Strapi will store: `https://bucket-name.s3.region.amazonaws.com/filename.jpg`
- Verify region and bucket name in `.env`

## 📝 File URL Format

**Local Storage:**
```
http://localhost:1337/uploads/filename_hash.jpg
```

**S3 Storage:**
```
https://your-bucket-name.s3.us-east-1.amazonaws.com/filename_hash.jpg
```

## 🔄 Migration from Local to S3

If you have existing files in local storage and want to migrate to S3:

1. Use AWS CLI or S3 console to upload files
2. Update database URLs (manual or script)
3. Maintain same folder structure

## 🌍 Environment-Specific Configuration

**Development (Local):**
```bash
UPLOAD_PROVIDER=local
```

**Production (S3):**
```bash
UPLOAD_PROVIDER=s3
AWS_ACCESS_KEY_ID=prod_key
AWS_SECRET_ACCESS_KEY=prod_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=production-bucket
```

## 📚 Additional Resources

- [Strapi Upload Documentation](https://docs.strapi.io/dev-docs/plugins/upload)
- [AWS S3 Provider](https://market.strapi.io/providers/@strapi-provider-upload-aws-s3)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

---

**Ready to test!** 🎉

Replace the placeholder values in `.env` with your actual AWS credentials and bucket information.
