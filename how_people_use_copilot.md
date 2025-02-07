# How do people use Copilot?

## GitHub Copilot Official Site
The Copilot is described in terms of its functionalities but does not provide recommendations on the best way to use it. Similarly, the "Frequently Asked Questions" section does not include user inquiries about how to make the most of it.

## Continue
The documentation for the "Continue" Copilot includes a section titled "How to use it." However, this section merely explains how to enable the Copilot within the IDE and lists the commands for managing the provided suggestions.

It does not offer guidance on how users can make the most of it to achieve optimal performance, better suggestions, and an improved user experience.

## Microsoft Learn - Get better responses by setting the context for GitHub Copilot Chat in Visual Studio
This Microsoft Learn article provides recommendations on how to obtain better responses from the Copilot by including specific information, such as context, the type of response expected (e.g., explanation, generation), or modifying the source used by Copilot to generate responses.

However, this approach is not relevant to our case, as in our static application, users cannot manage these parameters. Instead, we are interested in understanding how users interact with text input: how many characters they type before expecting a response, how long they wait, and how soon they resume typing if no suggestion is provided.

## GitHub Community
From the analysis of various questions and issues discussed on *GitHub Community*, it becomes clear that users expect to receive a suggestion after they stop typing, rather than while they are still writing.  
Their behavior follows this pattern:  
- They type  
- They stop typing and wait for a suggestion to complete what they have written  

## Possible Questions to Ask Copilot Users
Not finding any specific information while searching, I've compiled some questions for GitHub Copilot users.

**Questions:**
- How many characters do you type before waiting for a suggestion?
- How long do you wait for a suggestion before resuming typing?
- Do you ever delete and retype a part of the code to get a different suggestion from Copilot?
- How do you react when Copilot doesn't provide a relevant suggestion?

## Reddit Post
Based on the previously defined questions, I created a post on Reddit within the *GitHub Copilot* community to gather feedback from users based on their personal experience.

**Title:** *How do you approach using GitHub Copilot?*  
**Questions:**
- How many characters do you type before waiting for a suggestion?
- How long do you wait for a suggestion before resuming typing?

This is the post created:  
[Reddit Post](https://www.reddit.com/r/GithubCopilot/comments/1ij096y/how_do_you_approach_using_github_copilot/)

From the comments received so far, it is clear that users primarily fall into two categories:
- Those who use GitHub Copilot's text completion feature.
- Those who have decided to disable and not use this function.

Users who reported using Copilot’s suggestion feature mentioned that they typically type a few words (around 3-4) before waiting for a suggestion. They also expect the suggestion to appear almost instantly (within 100-200 ms) once they stop typing.

On the other hand, those who have disabled this feature explained that they did so because receiving a suggestion requires them to stop typing and wait, which, in their view, disrupts their coding flow. While this was not necessarily an expected response to the questions posed, it does confirm what was already observed within the GitHub community: users must pause their typing before receiving a suggestion.

Additionally, another user stated that they disabled this option because they do not feel sufficiently experienced to understand the suggestions and determine whether they are exactly what they need.

## How to Use This Information in Our Application
Currently, the application waits for the user to type a certain number of characters (10 characters) before displaying a suggestion. This approach is intended to create the impression that the suggestion is based on what the user has written so far.

With this implementation, the user does not need to stop typing to receive a suggestion; they simply need to reach the required number of characters.

To make the behavior more similar to GitHub Copilot, we could combine the minimum character threshold (potentially reducing it) with a timer that triggers the suggestion only a few milliseconds after the user has typed the last character.

## References
1. [GitHub Copilot](https://github.com/features/copilot)
2. [Continue Documentation](https://docs.continue.dev/autocomplete/how-to-use-it)
3. [Microsoft Learn - Copilot Chat Context](https://learn.microsoft.com/it-it/visualstudio/ide/copilot-chat-context?view=vs-2022)
4. [GitHub Community Discussions](https://github.com/orgs/community/discussions/123942)
