#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <dirent.h>
#include <fcntl.h>
#include <sys/stat.h>

int ls(char* s) {
  DIR *dir = opendir(s);
  if (dir) {
    struct dirent *s_dir;
    while((s_dir = readdir(dir))) {
      if (s_dir->d_type == DT_DIR) {
        printf("/%s\n", s_dir->d_name);
      } else {
        printf("%s\n", s_dir->d_name);
      }
    }
    return 0;
  } else {
    return -1;
  }
}

int echo(char* s) {
  printf("%s\n", s);
  return 0;
}

int pwd() {
  char *wd = malloc(1024 * sizeof(char));
  getcwd(wd, 1024 * sizeof(char));
  printf("%s\n", wd);
  return 0;
}

int cd(char* path) {
  return chdir(path);
}

int touch(char* filename, char* content) {
  FILE *fp;   
  fp = fopen(filename, "w");
  fprintf(fp, "%s", content);
  fclose(fp);
  return 0;
}

int cat(char* filename)
{
  FILE *fp;
  char buf[4096];
  if ((fp = fopen (filename, "r")) != NULL) {
    while (!feof (fp)) {
      fgets(buf, sizeof (buf), fp);
      printf("%s", buf);
    } 
    printf("\n");
  }
  else {
    return -1;
  }

  return 0;

}