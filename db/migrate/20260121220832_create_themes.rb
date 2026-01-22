class CreateThemes < ActiveRecord::Migration[8.1]
  def change
    create_table :themes do |t|
      t.jsonb :data
      t.boolean :disabled

      t.timestamps
    end
  end
end
