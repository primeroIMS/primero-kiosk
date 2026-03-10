# frozen_string_literal: true

# API controller for managing cases.
class Api::RecordsController < ApplicationApiController
  before_action :instantiate_app_services
  before_action :verify_captcha, only: [:create]

  def create
    PrimeroSyncJob.perform_later(record_params)
  end

  def record_params
    params.require(:record_type)
    params.expect(data: :module_id)
    params.permit(:record_type, :captcha_token, data: [:module_id] + permitted_field_ids)
  end

  def permitted_field_ids
    @permitted_field_ids ||= @permitted_field_service.permitted_field_ids
  end

  def instantiate_app_services
    @permitted_field_service = PermittedFieldService.instance
  end

  private

  def verify_captcha
    return true unless PrimeroKiosk::Application.config.captcha_enabled

    CaptchaService.verify(provider: PrimeroKiosk::Application.config.x.captcha_provider,
                          token: params[:captcha_token],
                          remote_ip: request.remote_ip)
  end
end
