# S3 Upload Quick Reference

## 🚀 Quick Start

### 1. Update .env file:
```bash
# Replace these with your actual AWS credentials
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
UPLOAD_PROVIDER=s3
```

### 2. Test S3 Connection:
```bash
npm run test:s3
```

### 3. Start Strapi:
```bash
npm run develop
```

## 📋 Pre-requisites Checklist

- [ ] AWS Account created
- [ ] S3 Bucket created
- [ ] IAM User created with S3 permissions
- [ ] Access Key ID obtained
- [ ] Secret Access Key obtained
- [ ] Bucket CORS configured
- [ ] Public access enabled (if needed)

## 🔑 Required .env Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | IAM User Access Key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM User Secret Key | `wJalrXUtnFEMI...` |
| `AWS_REGION` | AWS Region | `us-east-1` |
| `AWS_S3_BUCKET` | Bucket Name | `my-lms-bucket` |
| `AWS_S3_ENDPOINT` | Custom Endpoint (optional) | `https://...` |
| `UPLOAD_PROVIDER` | Storage Type | `s3` or `local` |

## 🧪 Testing Commands

```bash
# Test S3 configuration
npm run test:s3

# Start Strapi in development
npm run develop

# Build for production
npm run build
npm start
```

## 🔄 Switch Storage Provider

**Use Local Storage:**
```bash
UPLOAD_PROVIDER=local
```

**Use S3 Storage:**
```bash
UPLOAD_PROVIDER=s3
```

*Note: Restart Strapi after changing*

## 🌍 Common AWS Regions

- `us-east-1` - US East (N. Virginia)
- `us-west-2` - US West (Oregon)
- `eu-west-1` - Europe (Ireland)
- `ap-southeast-1` - Asia Pacific (Singapore)
- `ap-south-1` - Asia Pacific (Mumbai)

## 🔐 IAM Policy (Minimal Permissions)

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
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## 🌐 CORS Configuration (S3 Bucket)

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:1337",
      "http://localhost:3030",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Access Denied | Check IAM permissions |
| CORS Error | Configure bucket CORS |
| Wrong URL | Verify region and bucket name |
| Connection timeout | Check internet/VPN |
| Bucket not found | Create bucket or check name |

## 📊 File URL Formats

**Local:**
```
http://localhost:1337/uploads/filename_abc123.jpg
```

**S3:**
```
https://your-bucket.s3.us-east-1.amazonaws.com/filename_abc123.jpg
```

## 💡 Tips

1. **Start with Local** - Test with `UPLOAD_PROVIDER=local` first
2. **Test Script** - Always run `npm run test:s3` before going live
3. **Permissions** - Use minimal IAM permissions for security
4. **CORS** - Add all your domains to CORS configuration
5. **Backup** - Keep local backups of important files

## 📚 Documentation

- Full Guide: `S3_UPLOAD_GUIDE.md`
- Strapi Docs: https://docs.strapi.io/dev-docs/plugins/upload
- AWS S3 Docs: https://docs.aws.amazon.com/s3/

---

**Need help?** Check `S3_UPLOAD_GUIDE.md` for detailed instructions.
