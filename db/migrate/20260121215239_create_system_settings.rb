# frozen_string_literal: true

class CreateSystemSettings < ActiveRecord::Migration[8.1]
  def change
    create_table :system_settings do |t|
      t.jsonb :system_options

      t.timestamps
    end
  end
end
