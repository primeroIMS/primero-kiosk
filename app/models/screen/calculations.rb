# frozen_string_literal: true

# Represents the data structure for Calculations
class Screen::Calculations
  include JsonNestedModel

  attribute :risk, array: true
  attribute :fields, array: true
end
