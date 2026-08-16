package com.bookcircle.service;

/**
 * Abstraction for AI text generation.
 * Swap implementations to change provider (Gemini, OpenAI, Groq, etc.)
 */
public interface AiClient {

    /**
     * Send a prompt to the AI provider and return the generated text.
     *
     * @param prompt the instruction/prompt text
     * @return generated response text, or null if the provider fails
     */
    String generate(String prompt);
}
