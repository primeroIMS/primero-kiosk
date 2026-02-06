# frozen_string_literal: true

# Validates that an attribute is a valid hex color code.
class HexColorValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if /#\h{6}/.match?(value)

    record.errors.add attribute, (options[:message] || 'is not a valid hex color')
  end
end
