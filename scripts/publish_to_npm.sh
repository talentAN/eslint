#!/bin/bash

npx npm-cli-login
cd packages/eslint-config-sensorsdata  && npm publish || cd ../eslint-config-sensorsdata-react && npm publish || cd ../eslint-config-sensorsdata-typescript && npm publish
if [[ ${WX_ROBOT_WEBHOOK} == "" ]];then
	echo "还未关联微信通知地址，请到 gitlab 的 CI/CD 中的 Variables 页面中设置 WX_ROBOT_WEBHOOK 进行关联"
else
	curl ${WX_ROBOT_WEBHOOK} \
	-H 'Content-Type: application/json' \
	-d "
	{
			\"msgtype\": \"markdown\",
			\"markdown\": {
					\"content\": \"已发布<font color=\\\"info\\\">${CI_PROJECT_NAMESPACE}/${CI_PROJECT_NAME}</font>至 registry \nCommit:[${CI_COMMIT_SHORT_SHA}](http://gitlab.sensorsdata.cn/${CI_PROJECT_NAMESPACE}/${CI_PROJECT_NAME}/commit/${CI_COMMIT_SHA})\ntag:${CI_COMMIT_TAG}\"
			}
	}"
fi