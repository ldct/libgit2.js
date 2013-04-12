#include <stdio.h>
#include <git2.h>

int list_refs(git_repository* repo) {
  git_strarray ref_list;
  git_reference_list(&ref_list, repo, GIT_REF_LISTALL);

  const char *refname;
  git_reference *ref;
  
  char out[41];
  out[40] = '\0';
  
  int i;

  for (i = 0; i < ref_list.count; ++i) {
    refname = ref_list.strings[i];
    git_reference_lookup(&ref, repo, refname);

    switch (git_reference_type(ref)) {
    case GIT_REF_OID:
      git_oid_fmt(out, git_reference_target(ref));
      printf("%s %s\n", out, refname);
      break;
    case GIT_REF_SYMBOLIC:
      printf("%s => %s\n", refname, git_reference_symbolic_target(ref));
      break;
    default:
      fprintf(stderr, "Unexpected reference type\n");
      exit(1);
    }
  }

  git_strarray_free(&ref_list);
}

int list_refs_str(char* s) {
  git_repository* repo;

  git_repository_open(&repo, s);
  return list_refs(repo);
}
