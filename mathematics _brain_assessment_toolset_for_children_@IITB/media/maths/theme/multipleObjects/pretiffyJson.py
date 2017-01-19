import json
import sys

args = sys.argv
filename = args[1]
# print(args)
w = open(filename,'r')
json_data = w.read()

remove_extra_brackets_data = (json_data.split("=")[1])
# print (remove_extra_brackets_data)
count1 =0
for i in range(0,len(remove_extra_brackets_data)):
	if remove_extra_brackets_data[i] == '[':
		break
	count1 +=1

count2 = 0
for i in range(len(remove_extra_brackets_data)-1,-1,-1):
	if remove_extra_brackets_data[i] == ']':
		break
	count2 +=1


# print (count1, count2)
remove_extra_brackets_data = remove_extra_brackets_data[count1: -1*count2]
parsed_json = json.loads(remove_extra_brackets_data)
final_data = json.dumps(parsed_json,indent=5,sort_keys= False)
print(final_data)

new_file  = open('new_'+filename,'w')
new_file.write(final_data)
new_file.close()
w.close()
