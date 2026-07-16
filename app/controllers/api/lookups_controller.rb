# frozen_string_literal: true

# Controller for handling lookup data retrieval
class Api::LookupsController < ApplicationApiController
  def index
    @lookups = Lookup.includes(lookup_options: { icon_attachment: :blob }).all
  end
end
