# frozen_string_literal: true

# Represents the data structure for a RecordDefinition within an AppFlow.
class AppFlow::RecordDefinition
  include JsonNestedModel

  attribute :id, :string
  attribute :type, :string
  attribute :module_id, :string
  attribute :channel, hash: true

  validates :id, presence: true
  validates :type, presence: true
  validates :module_id, presence: true
end
