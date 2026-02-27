# frozen_string_literal: true

# Represents the meta structure for an AppFlow.
class AppFlow::Meta
  include JsonNestedModel

  attribute :bg_color, :string
  attribute :bg_selected_color, :string
  attribute :border_selected_color, :string
  attribute :exit_flow_bg_color, :string

  validates :bg_color, hex_color: true, allow_nil: true
  validates :bg_selected_color, hex_color: true, allow_nil: true
  validates :border_selected_color, hex_color: true, allow_nil: true
  validates :exit_flow_bg_color, hex_color: true, allow_nil: true
end
