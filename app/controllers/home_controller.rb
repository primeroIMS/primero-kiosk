# frozen_string_literal: true

# Home controller handles the root path of the application
class HomeController < ApplicationController
  def index
    @theme = Theme.current
    render layout: 'application'
  end
end
