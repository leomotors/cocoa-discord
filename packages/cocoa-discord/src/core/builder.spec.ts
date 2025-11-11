import { beforeEach, describe, expect, it, vi } from "vitest";

import { TypedSlashBuilder } from "./builder.js";

// Mock the SlashCommandBuilder
vi.mock("discord.js", () => {
  const MockSlashCommandBuilder = class {
    setName = vi.fn().mockReturnThis();
    setDescription = vi.fn().mockReturnThis();
    addAttachmentOption = vi.fn().mockReturnThis();
    addBooleanOption = vi.fn().mockReturnThis();
    addChannelOption = vi.fn().mockReturnThis();
    addIntegerOption = vi.fn().mockReturnThis();
    addMentionableOption = vi.fn().mockReturnThis();
    addNumberOption = vi.fn().mockReturnThis();
    addRoleOption = vi.fn().mockReturnThis();
    addStringOption = vi.fn().mockReturnThis();
    addUserOption = vi.fn().mockReturnThis();
  };

  return {
    SlashCommandBuilder: MockSlashCommandBuilder,
  };
});

describe("TypedSlashBuilder", () => {
  let builder: TypedSlashBuilder;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSlashCommandBuilder: any;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Create a new builder instance
    builder = new TypedSlashBuilder();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockSlashCommandBuilder = builder.builder as any;
  });

  describe("Delegate methods", () => {
    it("should call setName on SlashCommandBuilder with correct parameter", () => {
      const testName = "test-command";

      const result = builder.setName(testName);

      expect(mockSlashCommandBuilder.setName).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.setName).toHaveBeenCalledWith(testName);
      expect(result).toBe(builder); // Should return the builder for chaining
    });

    it("should call setDescription on SlashCommandBuilder with correct parameter", () => {
      const testDescription = "Test command description";

      const result = builder.setDescription(testDescription);

      expect(mockSlashCommandBuilder.setDescription).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.setDescription).toHaveBeenCalledWith(
        testDescription,
      );
      expect(result).toBe(builder); // Should return the builder for chaining
    });
  });

  describe("addAttachmentOption", () => {
    it("should call addAttachmentOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "file",
        description: "Upload a file",
        required: true,
      };

      const result = builder.addAttachmentOption(params);

      expect(
        mockSlashCommandBuilder.addAttachmentOption,
      ).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addAttachmentOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder); // Should return the builder for chaining
    });

    it("should create proper option builder function that sets name, description, and required", () => {
      const params = {
        name: "document",
        description: "Document to upload",
        required: false,
      };

      builder.addAttachmentOption(params);

      // Get the function that was passed to addAttachmentOption
      const optionBuilderFunction =
        mockSlashCommandBuilder.addAttachmentOption.mock.calls[0][0];

      // Create a mock option object
      const mockOption = {
        setName: vi.fn().mockReturnThis(),
        setDescription: vi.fn().mockReturnThis(),
        setRequired: vi.fn().mockReturnThis(),
      };

      // Call the option builder function
      optionBuilderFunction(mockOption);

      // Verify the option was configured correctly
      expect(mockOption.setName).toHaveBeenCalledWith("document");
      expect(mockOption.setDescription).toHaveBeenCalledWith(
        "Document to upload",
      );
      expect(mockOption.setRequired).toHaveBeenCalledWith(false);
    });
  });

  describe("addBooleanOption", () => {
    it("should call addBooleanOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "enabled",
        description: "Enable feature",
        required: true,
      };

      const result = builder.addBooleanOption(params);

      expect(mockSlashCommandBuilder.addBooleanOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addBooleanOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder);
    });
  });

  describe("addChannelOption", () => {
    it("should call addChannelOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "channel",
        description: "Select a channel",
        required: true,
      };

      const result = builder.addChannelOption(params);

      expect(mockSlashCommandBuilder.addChannelOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addChannelOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder);
    });
  });

  describe("addIntegerOption", () => {
    it("should call addIntegerOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "count",
        description: "Number of items",
        required: true,
      };

      const result = builder.addIntegerOption(params);

      expect(mockSlashCommandBuilder.addIntegerOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addIntegerOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder);
    });
  });

  describe("addMentionableOption", () => {
    it("should call addMentionableOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "target",
        description: "Mention a user or role",
        required: true,
      };

      const result = builder.addMentionableOption(params);

      expect(
        mockSlashCommandBuilder.addMentionableOption,
      ).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addMentionableOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder);
    });
  });

  describe("addNumberOption", () => {
    it("should call addNumberOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "amount",
        description: "Amount to process",
        required: true,
      };

      const result = builder.addNumberOption(params);

      expect(mockSlashCommandBuilder.addNumberOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addNumberOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder);
    });
  });

  describe("addRoleOption", () => {
    it("should call addRoleOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "role",
        description: "Select a role",
        required: true,
      };

      const result = builder.addRoleOption(params);

      expect(mockSlashCommandBuilder.addRoleOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addRoleOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder);
    });
  });

  describe("addStringOption", () => {
    it("should call addStringOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "message",
        description: "Message to send",
        required: true,
      };

      const result = builder.addStringOption(params);

      expect(mockSlashCommandBuilder.addStringOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addStringOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder);
    });
  });

  describe("addUserOption", () => {
    it("should call addUserOption on SlashCommandBuilder with correct parameters", () => {
      const params = {
        name: "user",
        description: "Select a user",
        required: true,
      };

      const result = builder.addUserOption(params);

      expect(mockSlashCommandBuilder.addUserOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addUserOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(result).toBe(builder);
    });
  });

  describe("Combined multiple add methods", () => {
    it("should handle chaining multiple add methods correctly", () => {
      const result = builder
        .setName("complex-command")
        .setDescription("A complex command with multiple options")
        .addStringOption({
          name: "text",
          description: "Some text input",
          required: true,
        })
        .addIntegerOption({
          name: "number",
          description: "Some number input",
          required: false,
        })
        .addBooleanOption({
          name: "flag",
          description: "Some boolean flag",
          required: false,
        })
        .addUserOption({
          name: "target",
          description: "Target user",
          required: true,
        })
        .addChannelOption({
          name: "channel",
          description: "Target channel",
          required: false,
        });

      // Verify all methods were called once
      expect(mockSlashCommandBuilder.setName).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.setDescription).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addStringOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addIntegerOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addBooleanOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addUserOption).toHaveBeenCalledOnce();
      expect(mockSlashCommandBuilder.addChannelOption).toHaveBeenCalledOnce();

      // Verify delegate methods were called with correct parameters
      expect(mockSlashCommandBuilder.setName).toHaveBeenCalledWith(
        "complex-command",
      );
      expect(mockSlashCommandBuilder.setDescription).toHaveBeenCalledWith(
        "A complex command with multiple options",
      );

      // Verify all add methods were called with functions
      expect(mockSlashCommandBuilder.addStringOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(mockSlashCommandBuilder.addIntegerOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(mockSlashCommandBuilder.addBooleanOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(mockSlashCommandBuilder.addUserOption).toHaveBeenCalledWith(
        expect.any(Function),
      );
      expect(mockSlashCommandBuilder.addChannelOption).toHaveBeenCalledWith(
        expect.any(Function),
      );

      // Verify the chaining returns the same builder instance
      expect(result).toBe(builder);
    });

    it("should properly configure all option builders in a chained call", () => {
      builder
        .addStringOption({
          name: "text",
          description: "Text input",
          required: true,
        })
        .addIntegerOption({
          name: "count",
          description: "Count value",
          required: false,
        })
        .addBooleanOption({
          name: "enabled",
          description: "Enable flag",
          required: true,
        });

      // Test string option builder
      const stringOptionBuilder =
        mockSlashCommandBuilder.addStringOption.mock.calls[0][0];
      const mockStringOption = {
        setName: vi.fn().mockReturnThis(),
        setDescription: vi.fn().mockReturnThis(),
        setRequired: vi.fn().mockReturnThis(),
        setAutocomplete: vi.fn().mockReturnThis(),
      };
      stringOptionBuilder(mockStringOption);
      expect(mockStringOption.setName).toHaveBeenCalledWith("text");
      expect(mockStringOption.setDescription).toHaveBeenCalledWith(
        "Text input",
      );
      expect(mockStringOption.setRequired).toHaveBeenCalledWith(true);

      // Test integer option builder
      const integerOptionBuilder =
        mockSlashCommandBuilder.addIntegerOption.mock.calls[0][0];
      const mockIntegerOption = {
        setName: vi.fn().mockReturnThis(),
        setDescription: vi.fn().mockReturnThis(),
        setRequired: vi.fn().mockReturnThis(),
        setAutocomplete: vi.fn().mockReturnThis(),
      };
      integerOptionBuilder(mockIntegerOption);
      expect(mockIntegerOption.setName).toHaveBeenCalledWith("count");
      expect(mockIntegerOption.setDescription).toHaveBeenCalledWith(
        "Count value",
      );
      expect(mockIntegerOption.setRequired).toHaveBeenCalledWith(false);

      // Test boolean option builder
      const booleanOptionBuilder =
        mockSlashCommandBuilder.addBooleanOption.mock.calls[0][0];
      const mockBooleanOption = {
        setName: vi.fn().mockReturnThis(),
        setDescription: vi.fn().mockReturnThis(),
        setRequired: vi.fn().mockReturnThis(),
      };
      booleanOptionBuilder(mockBooleanOption);
      expect(mockBooleanOption.setName).toHaveBeenCalledWith("enabled");
      expect(mockBooleanOption.setDescription).toHaveBeenCalledWith(
        "Enable flag",
      );
      expect(mockBooleanOption.setRequired).toHaveBeenCalledWith(true);
    });
  });

  describe("Custom builder function handling", () => {
    it("should call custom builder function when provided in addStringOption", () => {
      const customBuilder = vi.fn().mockReturnValue({
        setName: vi.fn().mockReturnThis(),
        setDescription: vi.fn().mockReturnThis(),
        setRequired: vi.fn().mockReturnThis(),
        setAutocomplete: vi.fn().mockReturnThis(),
      });

      builder.addStringOption({
        name: "custom",
        description: "Custom string option",
        required: true,
        builder: customBuilder,
      });

      // Get the option builder function that was passed to addStringOption
      const optionBuilderFunction =
        mockSlashCommandBuilder.addStringOption.mock.calls[0][0];

      // Create a mock option and call the builder function
      const mockOption = {
        setName: vi.fn().mockReturnThis(),
        setDescription: vi.fn().mockReturnThis(),
        setRequired: vi.fn().mockReturnThis(),
      };

      optionBuilderFunction(mockOption);

      // Verify the custom builder was called with the option
      expect(customBuilder).toHaveBeenCalledOnce();
      expect(customBuilder).toHaveBeenCalledWith(mockOption);
    });

    it("should work without custom builder function", () => {
      // This should not throw an error even without a custom builder
      expect(() => {
        builder.addStringOption({
          name: "simple",
          description: "Simple string option",
          required: true,
        });
      }).not.toThrow();

      expect(mockSlashCommandBuilder.addStringOption).toHaveBeenCalledOnce();
    });
  });
});
