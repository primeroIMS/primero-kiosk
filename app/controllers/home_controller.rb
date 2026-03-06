# frozen_string_literal: true

# Home controller handles the root path of the application
class HomeController < ApplicationController
  def index
    @theme = Theme.current
    render :index, layout: 'application', formats: [:html]
  end
end
