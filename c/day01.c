#include <stdio.h>
#include <stdlib.h>

int* read_ints(int* size) {
    static int INT_BUF[100000];
    char line_buf[1024];
    int* curr = INT_BUF;
    
    while (fgets(line_buf, 1024, stdin)) {
        *curr = atoi(line_buf);
        curr++;
    }
    *size = curr - INT_BUF;

    return INT_BUF;
}

int count_increases(int* numbers, int size) {
    int ret = 0;

    for (int i = 1; i < size; i ++) {
        if (numbers[i] > numbers[i - 1]) {
            ret++;
        }
    }

    return ret;
}

int main() {
    int size = 0;
    int *numbers = NULL;

    numbers = read_ints(&size);

    if (size < 2) {
        puts("Not enough numbers");
    } else {
        printf("%d\n", count_increases(numbers, size));
    }
}
