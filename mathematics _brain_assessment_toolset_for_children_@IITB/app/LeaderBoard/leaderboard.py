

class NoSuchSignAllowedError(Exception):
    def __init___(self,dErrorArguments):
        print 'only + and - are valid sign for ordering'
        


class LeaderBoard():
    ordering = ['-score','+penalty','-time_taken','+username','+school_name']
    objects = {}

    def __init__(self, username, score, penalty, time_taken, school_name):
        self.username = username
        self.score = score
        self.school_name = school_name
        self.time_taken = time_taken
        self.penalty = penalty

    def save(self):
        self.objects[self.username] = (self)

    def __repr__(self):
        return "<Leaderboard: %s %s %s %s %s >" % (self.username, self.score, self.penalty, self.time_taken, self.school_name)

    def __cmp__(self,other):
        for x in self.ordering:
            sign,att = x[0],x[1:]
            arg1 = getattr(self,att)
            arg2 = getattr(other,att)
            result = cmp(arg1,arg2)
            if result != 0:
                if sign == '+':
                    return result
                elif sign == '-':
                    return -1 * result
                else:
                    raise NoSuchSignAllowedError
        return 0            

    @staticmethod
    def sorted_objects():
        objects_new = LeaderBoard.objects.values()
        objects_new.sort()
        return objects_new

    


#create_and_save_leaderboard_record(username = 'mayank', score = 4, school_name = 'same3')
#create_and_save_leaderboard_record(username = 'kushal', score = 8, school_name = 'same2')
#create_and_save_leaderboard_record(username = 'khyati', score = 8, school_name = 'same1')



#for p in LeaderBoard.sorted_objects():
#    print p
