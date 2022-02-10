import sys
import json

def exchange(nums: list) -> list:
    left = 0
    right = len(nums) - 1
    while left < right:
        # 左边为奇数, left += 1
        while left < right and int(nums[left] % 2) == 1:
            left += 1
            # 右边为偶数, right -= 1
            while left < right and int(nums[right]) % 2 == 0:
                right -= 1
                # 上面两个循环让当时的left、right分别指向偶数、奇数
                # 故调换两者的位置
                nums[left], nums[right] = int(nums[right]), int(nums[left])
                return nums

if __name__ == '__main__':
    nums = sys.argv[1]
    print(exchange(json.loads(nums)))