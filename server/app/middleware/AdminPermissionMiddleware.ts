import { Request, Response, NextFunction } from "express";

const adminCheckRoles = (userRole: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user.role;

    if (!req.user || !role) {
      req.flash("error", "Access denied");
      return res.redirect("/login");
    }

    if (userRole.includes(role)) {
      next();
    } else {
      return res.redirect("/login");
    }
  };
};

export default adminCheckRoles;
