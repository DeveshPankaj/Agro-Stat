
setwd("/home/resources")
library("rjson")

path <- "file-main.csv"

content <- read.csv(path)
print(content)
# actions <- read.csv('actions.csv')
# json_data <- fromJSON(file="configs")
# print (json_data)


# print (content)
# print (actions)

# removeColumn <- function(column_id) {
#     print(paste("Removing", column_id, sep=" "))
# }

# renameColumn <- function(column_id, new_name) {
#     print(paste("Renaming", column_id, "=>", new_name, sep=" "))
# }

# # load column from file to variable
# copyColumn <- function(column_id, source_var, column_name, dist_var) {
#     print("Loading column [] from [] to [] at []")

#     cmd="1+2"
#     print(eval(parse(text=cmd)))
# }


# for(i in 1:nrow(actions)) {
#     action <- actions[i, 1]
#     arg1 <- actions[i, 2]
#     arg2 <- actions[i, 3]
#     arg3 <- actions[i, 4]

#     switch(action,
#         rename= renameColumn(arg1, arg2),
#         remove= removeColumn(arg1),
#         copy= copyColumn(arg1, "xx", arg2, arg3)
#     )
# }
