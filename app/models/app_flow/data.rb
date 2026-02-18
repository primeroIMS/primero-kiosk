# frozen_string_literal: true

# Represents the data structure for an AppFlow.
class AppFlow::Data
  include JsonNestedModel

  attribute :unique_id, :string
  attribute :handle, :string
  attribute :starting_screen_id, :string
  attribute_array :record_definitions, AppFlow::RecordDefinition
end
