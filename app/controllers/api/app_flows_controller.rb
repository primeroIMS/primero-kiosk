# frozen_string_literal: true

# Controller for handling API requests related to AppFlows.
class Api::AppFlowsController < ApplicationApiController
  def index
    @app_flows = AppFlow.includes(:screens).all
  end
end
