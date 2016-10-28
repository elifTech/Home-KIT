<h2>AWS IOT account setup</h2>
<ul>
  <li>After creating AWS account choose EU(Frankfurt) region (eu-central-1) on top right part of AWS console.</li>
  <li>In AWS services choose AWS IOT, then in AWS IOT - crearte resourse -> create thing. Enter the name of your thing and press "Create" (remeber that the names of your things must be such as in your Raspberry server)</li>
  <li>Go to AWS services -> Lambda
    <ul>
      <li>Choose "Create lambda function" -> Blank function -> "Next"</li>
      <li>Enter your function name (reccomend such as thing name), Runtime value must be "Node.Js 4.3".</li>
      <li>In next field insert your lambda function code. In lambda function you must insert domain of your thing REST API (you can find it on IoT console in your thing menu). Domain must be in next format: <code>a36sxknx4xuifs.iot.eu-central-1.amazonaws.com</code>. Also don't forget to set the name of your thing in this function.</li>
      <li>In Role field choose "Create a castom role" and you will be redirected to IAM Management Console
        <ul>
          <li>In this form set next values: IAM Role => "Create a new IAM Role", Name => (role name)</li>
          <li>Then press on "View policy document" -> "Edit" and insert next code: 
          <code>{
              "Version": "2012-10-17",
              "Statement": [
              {
               "Effect": "Allow",
               "Action": [
               "logs:CreateLogGroup",
               "logs:CreateLogStream",
               "logs:PutLogEvents",
               "iot:*"
               ],
             "Resource": "*"
            }
           ]
         }</code> and press "Allow".
          </li>
        </ul>
      </li>
      <li>Choose "Choose existing role" in role field and choose your role after</li>
      <li>Press "Next"</li>
    </ul>
  </li>
  <li>Return to IOT console, press on your thing and choose "Create rule"
    <ul>
      <li>Get your rule name, Attribute value must be "*".</li>
      <li>Topic filter value you must to get by pressing on your thing and copying "MQTT topic" value from this thing.</li>
      <li>In Choose an action select "Insert this message into a code function and execute it (Lambda)", then choose your function and press "Add action"</li>
      <li>After that press "Create"</li>
    </ul>
  </li>
  <li>In your thing choose "Connect device" -> "Node.Js" and press "Generate certificate and policy"</li>
  <li>Download each your certificate/key</li>
</ul>
