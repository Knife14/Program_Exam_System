import sys
import json

def twoSum(nums: list, target: int) -> list:
    result = []
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if int(nums[i]) + int(nums[j]) == target:
                result.append(i)
                result.append(j)
                return result

if __name__ == '__main__':

    (nums, target) = sys.argv[1:]

    res = twoSum(json.loads(nums), int(target))
    
    print(res)