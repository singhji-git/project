import sys
args = sys.argv
filename = args[1]
# print(args)
w = open(filename,'r')
data = w.readlines()
replace = ['\n',' ','\t','\b']
convert_to = ''
for r in replace:
	data = data.replace(r,convert_to)

print(data)