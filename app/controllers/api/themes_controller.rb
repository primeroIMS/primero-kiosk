# frozen_string_literal: true

# API to fetch the active theme
class Api::ThemesController < ApplicationController
  before_action :theme

  def index; end

  def manifest; end

  def theme
    @theme = Theme.current
  end
end
