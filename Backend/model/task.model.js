const { uuid, varchar, pgTable } = require("drizzle-orm/pg-core");

const TaskTable = pgTable("task", {
  id: uuid().defaultRandom().primaryKey(),
  Work: varchar({ length: 255 }).notNull(),
  Date: varchar({ length: 255 }).notNull(),
});
module.exports = { TaskTable };
