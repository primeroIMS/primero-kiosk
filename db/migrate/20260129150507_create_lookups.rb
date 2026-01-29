class CreateLookups < ActiveRecord::Migration[8.1]
  def change
    create_table :lookups do |t|
      t.string :value
      t.string :label
      t.string :description

      t.timestamps
    end
  end
end
