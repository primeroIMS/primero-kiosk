# frozen_string_literal: true

# Controller to fetch Screens
class Api::ScreensController < ApplicationApiController
  def index
    @screens = Screen.all
  end
end
