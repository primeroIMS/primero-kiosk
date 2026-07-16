# frozen_string_literal: true

# Controller for handling API requests related to AppFlows.
class Api::AppFlowsController < ApplicationApiController
  def index
    @app_flows = AppFlow.includes(
      logo_attachment: :blob,
      logo_pictorial_attachment: :blob,
      logo_pictorial_secondary_attachment: :blob,
      screens: { featured_image_attachment: :blob }
    ).all
  end
end
