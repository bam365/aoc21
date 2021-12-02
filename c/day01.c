#include <stdio.h>
#include <stdlib.h>

int main() {
    char linebuf[1024];
    int nprev, n;
    int answer = 0;

    fgets(linebuf, 1024, stdin);
    nprev = atoi(linebuf);
    while(fgets(linebuf, 1024, stdin)) {
        n = atoi(linebuf);
        if (n > nprev) {
            answer++;
        }
        nprev = n;
    }
    printf("%d\n", answer);
}
