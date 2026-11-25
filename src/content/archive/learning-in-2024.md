---
title: "Learning in 2024"
description: "Blaaa"
date: 2025-04-07
type: Essay
status: wip
tags: ["life", "web"]
featured: true
published: true
slug: "Learning in 2024"
cover: "/garden/learning-in-2024/cover.png"
---

New year new me . II have about 4 years working as a developer , I mostly focus on web technologies , mainly frontend developmemnt using React, Next , Svelte etc ( Or any React based framework)

Over the years the way i learn things has always been unstructured , this is noit to say i didnt get learn anything . I figured however that i spend a lot of time thinking about what to learn instead of doing much learning . This results in me having a long list of mini projects that never get too far . This is obviously frustrating coz you feel like you are always doing something , but nothing much to show for it . 

My career also started in a confusing way . I had many attempts f learning web dev on my own , first mistake was me diving straight into react with no  just a few weeks of doing a project based coding bootcamp . I then bought about 2-3 udemy corses that i never finished . I learnt most of what i know from coding at work mostly using nextjs from the nextjs 10 days with the pages router  I have seen the framework grow . I have played with Redux ,  I have had a fair share of play with AWS, I used services like Cognito for auth, S3 for hosting  the app, 

TLDR is that coding along does not work, so now i am doing moe hands on

### Motivations for thius blog post
- Guiding junior devson how to pivk whst to focus on first ( Cautionary tale )
- Why I am learning the cloud directly (I have been doing some serverless apps indirectly by working with frameworks like nextjs , and hosting via vercel who handle s all of that for us)

## Techs I have my eyes on 2024
- AWS (Serverless) ( IAM, ARN, S3, CloudFront,, CloudWatch, SNS ,SQS , EventBrigbe etc) . I have decided to learn aws by doing hands on projects and will be using SST framework
- SvelteKit ( I am suffering a bit from React fatigue , so need to play with other tech) ( Doing this so that i can teach my mentees svelte over react)
- React Native - using this for a long term project at work ( we are also using redux toolkit)
- Ecommerce dev (mostly for agency work)

And that is all folks , all my learning will revolve around this , i will be building more fullstack apps the serverless way using SST.

 
### Projects
- Notes App ( AWS intro using SST) (JAnuary till Feb)
- Move my blog to nextjs app dir  still use notion (write blog post) (urgent project), host on vercel
- Move my blog to astro , use isr and use SST features still use notion (write blog post) (urgent project), host on vercel
- Recruitment app(interns) / artistico (app to help artists to perfom at festivals etc) \[ this will be either sveltekit/ uploadthing for blob storage , sqs for emails , cognito for auth )? / use  saas products ⇒ uploadthing, clerk/kinde / Lucia for auth, maybe pocketbase( BAAS)
- Learn and practice Javascript/React for interviews {color="red"}
- Blog more about my learning
- {color="blue"}
-
### **Implementation Steps: (Porting blog to astro notion cms, sst webhook)**
1. **Set Up Your Astro Project**:
	- Initialize and configure your Astro project.
	- Integrate your content source (like Notion) into the build process.
2. **Configure AWS with SST**:
	- Set up your SST environment.
	- Use the **`StaticSite`** construct to configure the static site hosting with S3 and CloudFront.
3. **Webhook Configuration**:
	- Implement webhooks in your CMS or use services like Zapier to create triggers based on content updates.
	- Create AWS Lambda functions to handle webhook events and trigger the rebuild of your site.
4. **CI/CD Pipeline**:
	- Set up a CI/CD pipeline (AWS CodePipeline, GitHub Actions, etc.) to automate the build and deployment process.
	- Ensure the pipeline is triggered by the Lambda function upon receiving a webhook event.
5. **Cache Invalidation**:
	- Configure cache invalidation strategies in CloudFront to ensure updated content is served after each rebuild.
6. **Testing and Monitoring**:
	- Thoroughly test the webhook and build process to ensure it works as expected.
	- Set up monitoring and logging (using AWS CloudWatch or similar tools) to track the performance and execution of your Lambdas and the build process.
7. **Documentation and Maintenance**:
	- Document your setup and workflow for future reference and maintenance.
	- Keep an eye on the performance and costs, making adjustments as necessary.
