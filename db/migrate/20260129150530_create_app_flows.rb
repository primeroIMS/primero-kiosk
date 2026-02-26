# frozen_string_literal: true

class CreateAppFlows < ActiveRecord::Migration[8.1]
  def change
    create_table :app_flows do |t|
      t.jsonb :data

      t.timestamps
    end
  end
end
