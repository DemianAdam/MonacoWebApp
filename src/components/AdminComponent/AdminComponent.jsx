import React from "react";

export default function AdminComponent({ user, children }) {

    return user && user.role && user.role === 'admin' && children;
}




