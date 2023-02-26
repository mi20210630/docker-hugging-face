from transformers import pipeline, Conversation


class Chatbot:
    def __init__(self, icebreaker):
        self.prompts = [icebreaker]
        self.model = pipeline(model="microsoft/DialoGPT-medium")
        self.conversation = Conversation(icebreaker)

    def break_the_ice(self):
        self.conversation = self.model(self.conversation)
        return self.conversation.generated_responses[-1]

    def respond(self, response):
        self.prompts.append(response)
        self.conversation.add_user_input(response)
        self.conversation = self.model(self.conversation)
        return self.conversation.generated_responses[-1]
