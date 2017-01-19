import functools

"""
    Exception
        Error raised for wrong signs used for ordering
"""

class NoSuchSignAllowedError(Exception):
    def __init___(self,dErrorArguments):
        print ('only + and - are valid sign for ordering')
        


"""
    Class

     * LeaderBoard class for generated leaderboard among the  objects in variable objects hashMap
     * Sign allowed are + and - where + stands for ascending order and - for descending
"""

class LeaderBoard():


    ordering = ['-score','-penalty','-time_taken','+username','+school_name']
    objects = {}


    """
        Constructor
            used for creation of objects of this class
    """
    def __init__(self, username, score, penalty, time_taken, school_name):
        self.username = username
        self.score = score
        self.school_name = school_name
        self.time_taken = time_taken
        self.penalty = penalty
        self.rank = 0


    """
        Method
            Used for saving objects in the static variable objects of the class
    """
    def save(self):
        self.objects[self.username] = (self)


    """
        Method
            Representation of leaderboard objects used while printing the object
    """
    def __repr__(self):
        return "<Leaderboard: %s %s %s %s %s >" % (self.username, self.score, self.penalty, self.time_taken, self.school_name)


    """
        Method
            Used for comparision of objects of this class
        @return 
    """
    def __lt__(self,other):
        print ('Comparing these ',self, other)
        for x in self.ordering:
            sign,att = x[0],x[1:]
            arg1 = getattr(self,att)
            arg2 = getattr(other,att)
            if str(arg1).isnumeric():
                print ('numeric 1')
            if str(arg2).isnumeric():
                print ('numeric 2')
            result = (arg1 > arg2) - (arg1 < arg2)

            print (arg1, arg2, 'on', x, 'result', result)
            if result != 0:
                if sign == '+':
                    return  arg1 < arg2
                elif sign == '-':
                    return  arg1 > arg2
                else:
                    raise NoSuchSignAllowedError
        return 0     


    """
        Static Method
            Used for searching of objects present in user_list with 
            in the leaderboard with the search_text as keyword for search

        @return filtered result list 
    """
    @staticmethod
    def filter(user_list,search_text):
        filtered_list = []
        for user in user_list:
            print (search_text ,'  ' , user.username)
            if search_text.lower() in user.username.lower() or search_text.lower() in user.school_name.lower():
                filtered_list.append(user)
                print ('yes')

        return filtered_list

    """
        Static Method
            Used for sorting the objects present in objects hashmap
        @return sorted objects list
    """

    @staticmethod
    def sorted_objects():
        objects_new = LeaderBoard.objects.values()
        objects_new = sorted(objects_new)
        i = 1
        for object in objects_new:
            object.rank = i
            i += 1
            print ('object is ' )
            print(object)
        
        LeaderBoard.objects.clear()
        return objects_new
