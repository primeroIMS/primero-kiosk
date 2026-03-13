# frozen_string_literal: true

# API controller for managing cases.
class Api::RecordsController < ApplicationApiController
  before_action :instantiate_app_services
  before_action :verify_captcha, only: [:create]

  def create
    validate_record_json!(record_params.to_h)
    PrimeroSyncJob.perform_later(record_params)
  end

  def record_params
    params.require(:record_type)
    params.expect(data: :module_id)
    @record_params ||= params.permit(:record_type, :captcha_token, data: [:module_id] + permitted_params)
  end

  def validate_record_json!(data)
    schema = JsonSchemaService.create(permitted_fields)
    json_schemer = JSONSchemer.schema(schema)
    return if json_schemer.valid?(data)

    error = Errors::InvalidRecordJson.new('Invalid Record JSON')
    error.invalid_props = json_schemer.validate(data).map { |v| v['data_pointer'] }
    raise error
  end

  def permitted_fields
    @permitted_fields ||= @permitted_field_service.permitted_fields
  end

  def permitted_params
    @permitted_params ||= permitted_fields.map do |field|
      next(field.backend_id.to_sym) unless Screen::Data::MULTISELECT_COMPONENTS.include?(field.component)

      { field.backend_id.to_sym => [] }
    end
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
