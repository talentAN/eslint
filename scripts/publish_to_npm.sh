#!/bin/bash

npx npm-cli-login
cd packages
cd @spe || mkdir @spe && cd @spe
npm publish
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
