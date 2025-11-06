DEV_S3_BUCKET_NAME = admin.staging-bridge.tari.com
DEV_DISTRIBUTION_ID = E30RD7TH79WLJL

PROD_S3_BUCKET_NAME = admin.bridge.tari.com
PROD_DISTRIBUTION_ID = E1BZL3M6IQYL5A

.PHONY: build deploy-dev deploy-prod

build:
	npm run build

deploy-dev: build
	aws s3 sync --quiet dist s3://${DEV_S3_BUCKET_NAME} --delete --exact-timestamps
	aws cloudfront create-invalidation --distribution-id ${DEV_DISTRIBUTION_ID} --paths "/*"

deploy-prod: build
	aws s3 sync --quiet dist s3://${PROD_S3_BUCKET_NAME} --delete --exact-timestamps
	aws cloudfront create-invalidation --distribution-id ${PROD_DISTRIBUTION_ID} --paths "/*"
