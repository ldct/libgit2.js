#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <dirent.h>
#include <fcntl.h>
#include <sys/stat.h>

int ls(char *s) {
    DIR *dir = opendir(s);
    if (dir) {
        struct dirent *s_dir;
        while((s_dir = readdir(dir))) {
            printf("%s ", s_dir->d_name);
        }
        printf("\n");
        return 0;
    } else {
        return -1;
    }
}

int echo(char *s) {
    printf("%s\n", s);
    return 0;
}

int pwd() {
    char *wd = malloc(1024 * sizeof(char));
    getcwd(wd, 1024 * sizeof(char));
    printf("%s\n", wd);
    return 0;
}

int cd(char *path) {
    return chdir(path);
}

int touch(char *filename, char *content) {

    FILE *fp;   
    fp = fopen(filename, "w");
    fprintf(fp, "%s", content);
    fclose(fp);
    return 0;
}
