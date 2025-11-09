/**
 * Patch for @strapi/provider-upload-aws-s3 to disable ACL for buckets with ACLs disabled
 * This overrides the default behavior that always sets ACL to 'public-read'
 */

const originalProvider = require('@strapi/provider-upload-aws-s3');

module.exports = {
  init(config) {
    const provider = originalProvider.init(config);
    
    // Override upload methods to remove ACL parameter
    const originalUpload = provider.upload;
    const originalUploadStream = provider.uploadStream;
    
    provider.upload = async (file, customParams = {}) => {
      // Remove ACL from customParams if present
      const { ACL, ...restParams } = customParams;
      return originalUpload(file, restParams);
    };
    
    provider.uploadStream = async (file, customParams = {}) => {
      // Remove ACL from customParams if present
      const { ACL, ...restParams } = customParams;
      return originalUploadStream(file, restParams);
    };
    
    return provider;
  },
};
