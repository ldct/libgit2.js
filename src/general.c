#include <git2.h>
#include <stdio.h>

#include "libcore.h"

int general() {

  git_repository* repo;
  git_index* index;
  
  git_repository_init(&repo, "gitteh", 0);
  touch("gitteh/readme", "a sample directory\n");
  
  git_repository_index(&index, repo);
  git_index_add_bypath(index, "readme");
  
  return 0;
}
